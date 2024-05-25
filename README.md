docker build -t encalls/adago-backend .
docker run --name adago-backend -p 3000:3000 encalls/adago-backend
docker push encalls/adago-backend

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl get pod
kubectl get service
kubectl -n adago describe certificate letsencrypt-prod
