docker build -t encall/cpe241-express .
docker run --name cpe241-backend -p 3000:3000 encall/cpe241-express

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl get pod
kubectl get service
