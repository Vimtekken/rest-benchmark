FROM python:latest

RUN pip install flask
WORKDIR /app
ENV FLASK_APP=main.py
ADD ./src /app
ENTRYPOINT [ "python3", "-m", "flask", "run", "--host=0.0.0.0" ]
