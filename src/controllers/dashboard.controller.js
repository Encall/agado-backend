const db = require('../configs/db');

exports.getMostFlightsAirlinePerMonth = async (req, res) => {
    try {
        // If month and year are not provided, use the current month and year
        if (!req.params.month || !req.params.year) {
            const currentDate = new Date();
            month = currentDate.getMonth() + 1; // JavaScript months are 0-based
            year = currentDate.getFullYear();
        }

        const query = `
        SELECT airline.airlineName, COUNT(*) as flights
        FROM flight
        INNER JOIN aircraft ON flight.aircraftID = aircraft.aircraftID
        INNER JOIN airline ON aircraft.airlineID = airline.airlineID
        WHERE MONTH(flight.departureDateTime) = ? AND YEAR(flight.departureDateTime) = ?
        GROUP BY airline.airlineName
        ORDER BY flights DESC
        LIMIT 1
        `;

        const [monthlyFlightsAirlines] = await db.query(query, [month, year]);
        // console.log(monthlyFlightsAirlines);
        return res.status(200).json(monthlyFlightsAirlines);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMostAirlineRevenue = async (req, res) => {
    try {
        const query =
            'SELECT airline.airlineName, ROUND(SUM(ticket.price), 3) AS revenue FROM ticket INNER JOIN booking ON ticket.bookingID = booking.bookingID INNER JOIN flight ON booking.flightID = flight.flightID INNER JOIN aircraft ON flight.aircraftID = aircraft.aircraftID INNER JOIN airline ON aircraft.airlineID = airline.airlineID WHERE MONTH(flight.departureDateTime) = MONTH(CURRENT_DATE()) AND YEAR(flight.departureDateTime) = YEAR(CURRENT_DATE()) GROUP BY airline.airlineName ORDER BY SUM(ticket.price) DESC LIMIT 1';
        const [mostRevenueAirlines] = await db.query(query);
        // console.log(mostRevenueAirlines);
        return res.status(200).json(mostRevenueAirlines);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMostPopularDestinations = async (req, res) => {
    try {
        const query =
            'SELECT airport.airportName, COUNT(*) AS flights FROM flight INNER JOIN airport ON flight.arrivalAirportID = airport.airportID GROUP BY airport.airportName ORDER BY flights DESC LIMIT 1';
        const [mostPopularDestinations] = await db.query(query);
        // console.log(mostPopularDestinations);
        return res.status(200).json(mostPopularDestinations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRevenuePerDay = async (req, res) => {
    try {
        let query = `
        SELECT ROUND(SUM(ticket.price), 3) AS revenue, DAYOFWEEK(flight.departureDateTime) as weekday
        FROM ticket 
        INNER JOIN booking ON ticket.bookingID = booking.bookingID 
        INNER JOIN flight ON booking.flightID = flight.flightID 
        WHERE DATE(flight.departureDateTime) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL DAYOFWEEK(CURRENT_DATE())-1 DAY) AND DATE_ADD(CURRENT_DATE(), INTERVAL 7-DAYOFWEEK(CURRENT_DATE())+1 DAY)
        GROUP BY DAYOFWEEK(flight.departureDateTime)
        ORDER BY weekday ASC
    `;
        const [revenuePerDay] = await db.query(query);
        // console.log(revenuePerDay);

        // Initialize an object with all weekdays set to zero
        const days = [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
        ];
        let revenuePerWeekday = {};
        days.forEach((day) => (revenuePerWeekday[day] = 0));

        // Update the revenue for each weekday
        revenuePerDay.forEach((item) => {
            revenuePerWeekday[days[item.weekday - 1]] = item.revenue;
        });

        // console.log(revenuePerWeekday);
        return res.status(200).json(revenuePerWeekday);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFlightsPerWeek = async (req, res) => {
    try {
        const query = `
            SELECT COUNT(*) as flights, WEEK(flight.departureDateTime) as week, airline.airlineName as name
            FROM flight
            INNER JOIN aircraft ON flight.aircraftID = aircraft.aircraftID
            INNER JOIN airline ON aircraft.airlineID = airline.airlineID
            WHERE YEAR(flight.departureDateTime) = YEAR(CURRENT_DATE())
            AND WEEK(flight.departureDateTime) BETWEEN WEEK(CURRENT_DATE()) - 4 AND WEEK(CURRENT_DATE()) + 4
            GROUP BY WEEK(flight.departureDateTime), airline.airlineName
            ORDER BY week ASC, name ASC
        `;
        const [flightsPerWeek] = await db.query(query);

        const transformedData = flightsPerWeek.reduce((acc, curr) => {
            const existingAirline = acc.find((item) => item.name === curr.name);
            if (existingAirline) {
                existingAirline.data.push(curr.flights);
            } else {
                // Generate a color based on the airline name
                let hash = 0;
                for (let i = 0; i < curr.name.length; i++) {
                    hash = curr.name.charCodeAt(i) + ((hash << 5) - hash);
                }
                let color = '#';
                for (let i = 0; i < 3; i++) {
                    const value = (hash >> (i * 8)) & 0xff;
                    color += ('00' + value.toString(16)).substr(-2);
                }

                acc.push({
                    name: curr.name,
                    data: [curr.flights],
                    color: color,
                });
            }
            return acc;
        }, []);
        // console.log(transformedData);

        return res.status(200).json(transformedData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDailyPassenger = async (req, res) => {
    try {
        const query =
            'SELECT COUNT(*) as passengers, DATE(flight.departureDateTime) as date FROM ticket INNER JOIN booking ON ticket.bookingID = booking.bookingID INNER JOIN flight ON booking.flightID = flight.flightID WHERE DATE(flight.departureDateTime) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND CURRENT_DATE() GROUP BY DATE(flight.departureDateTime) ORDER BY date ASC';
        const [dailyPassengers] = await db.query(query);
        // console.log(dailyPassengers);
        return res.status(200).json(dailyPassengers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAirlineRevenue = async (req, res) => {
    try {
        const query = `
            SELECT airline.airlineName, ROUND(SUM(ticket.price), 3) AS revenue, 
            DATE_FORMAT(MIN(flight.departureDateTime), '%d %M %Y') AS revenueStartDate, 
            DATE_FORMAT(MAX(flight.departureDateTime), '%d %M %Y') AS lastRevenueDate
            FROM ticket 
            INNER JOIN booking ON ticket.bookingID = booking.bookingID 
            INNER JOIN flight ON booking.flightID = flight.flightID 
            INNER JOIN aircraft ON flight.aircraftID = aircraft.aircraftID 
            INNER JOIN airline ON aircraft.airlineID = airline.airlineID 
            GROUP BY airline.airlineName 
            ORDER BY SUM(ticket.price) DESC
            `;
        const [airlineRevenue] = await db.query(query);
        return res.status(200).json(airlineRevenue);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.totalPassenger = async (req, res) => {
    try {
        const query = 'SELECT COUNT(*) as totalPassenger FROM ticket';
        const [totalPassenger] = await db.query(query);
        return res.status(200).json(totalPassenger);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.flightsDestination = async (req, res) => {
    try {
        const query = `
        SELECT 
            arrivalAirport.city AS destinationCity,
            COUNT(DISTINCT f.flightID) AS flightCount,
            COUNT(DISTINCT p.passengerID) AS passengerCount
        FROM flight AS f
        LEFT JOIN booking AS b ON f.flightID = b.flightID
        LEFT JOIN passenger AS p ON b.bookingID = p.bookingID
        JOIN airport AS arrivalAirport ON f.arrivalAirportID = arrivalAirport.airportID
        GROUP BY arrivalAirport.city
        ORDER BY flightCount DESC, passengerCount DESC;
    `;
        const [mostPopularDestination] = await db.query(query);
        return res.status(200).json(mostPopularDestination);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.mostUsedAircraft = async (req, res) => {
    try {
        const query = `
        SELECT 
            ac.manufacturer,
            ac.model,
            COUNT(f.flightID) AS flightCount
        FROM flight AS f
        JOIN aircraft AS ac ON f.aircraftID = ac.aircraftID
        GROUP BY ac.model
        ORDER BY flightCount DESC
        LIMIT 1;
        `;
        const [mostUsedAircraft] = await db.query(query);
        return res.status(200).json(mostUsedAircraft[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.statusPercentage = async (req, res) => {
    try {
        const totalQuery = `
        SELECT COUNT(*) AS totalBookings
        FROM booking
        WHERE MONTH(bookingDateTime) = MONTH(CURRENT_DATE()) AND YEAR(bookingDateTime) = YEAR(CURRENT_DATE());
    `;
        const statusQuery = `
        SELECT bookingStatus, COUNT(*) AS count
        FROM booking
        WHERE MONTH(bookingDateTime) = MONTH(CURRENT_DATE()) AND YEAR(bookingDateTime) = YEAR(CURRENT_DATE())
        GROUP BY bookingStatus;
    `;

        const [totalResult] = await db.query(totalQuery);
        const totalBookings = totalResult[0].totalBookings;

        const [statusResults] = await db.query(statusQuery);
        const statusPercentages = statusResults.map((result) => ({
            status:
                result.bookingStatus.charAt(0).toUpperCase() +
                result.bookingStatus.slice(1),
            percentage: parseFloat(
                ((result.count / totalBookings) * 100).toFixed(2)
            ),
        }));

        return res.status(200).json(statusPercentages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.usercount = async (req, res) => {
    try {
        const query = 'SELECT COUNT(*) as userCount FROM userAccount';
        const [userCount] = await db.query(query);
        return res.status(200).json(userCount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.employeeCount = async (req, res) => {
    try {
        const query = 'SELECT COUNT(*) as employeeCount FROM employee';
        const [employeeCount] = await db.query(query);
        return res.status(200).json(employeeCount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.airlinePercentage = async (req, res) => {
    try {
        const totalQuery = `
            SELECT COUNT(*) as total 
            FROM booking
        `;
        const [totalBookingsResult] = await db.query(totalQuery);
        const totalBookings = totalBookingsResult[0].total;

        const airlineQuery = `
            SELECT airline.airlineName, COUNT(*) as count
            FROM booking
            INNER JOIN flight ON booking.flightID = flight.flightID
            INNER JOIN aircraft ON flight.aircraftID = aircraft.aircraftID
            INNER JOIN airline ON aircraft.airlineID = airline.airlineID
            GROUP BY airline.airlineName;
        `;
        const [airlineCounts] = await db.query(airlineQuery);

        const airlinePercentages = airlineCounts.map((airline) => {
            // Generate a color based on the airline name
            let hash = 0;
            for (let i = 0; i < airline.airlineName.length; i++) {
                hash = airline.airlineName.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xff;
                color += ('00' + value.toString(16)).substr(-2);
            }

            // Calculate the percentage
            const percentage = parseFloat(
                ((airline.count / totalBookings) * 100).toFixed(2)
            );

            return {
                name: airline.airlineName,
                data: percentage,
                color: color,
            };
        });

        res.status(200).json(airlinePercentages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });
    }
};
