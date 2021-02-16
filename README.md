# YOLO! Lets look at Pushshift.io Reddit data for Stonk Tips

I wanted to send out many thanks to Part Time Larry for inspiring this project. I watched his [video](https://youtu.be/CJAdCLZaISw) on his [channel](https://www.youtube.com/c/parttimelarry/videos). He has awesome videos on using your software developer skills to invest and find out more information on finances.

To run this project you will need to have Node.js and Docker installed on your computer. These examples require a TimescaleDB database. TimescaleDB is an extention to the Postgres database.

1) Add a directory to your local file system for storing the data. On my system I created one called `timescale-data`.

```bash
> mkdir ${HOME}/timescale-data
```

2) Run the following command in your terminal to start a local instance of TimescaleDB

```bash
> docker run -d --name dev-timescaledb -e POSTGRES_PASSWORD=password -v ${HOME}/timescale-data/:/var/lib/postgresql/data -p 5432:5432 postgres
```

This will have started a local instance of TimescaleDB. 

3) Now check and see if TimescaleDB is running. Run the following command;

```
> docker ps
```

This will list all running instance on your docker machine.

4) Stop the docker instance by using the following command;

```bash
> docker stop dev-timescaledb
```

5) To view your local image of this in docker use the following command;

```bash
> docker ps -a
```

6) Start the instance back up by using the following command;

```bash
> docker start dev-timescaledb
```

7) Enter into the TimescaleDB container by typing in the following command;

```bash
> docker exec -it dev-timescaledb psql -U postgres
```

8) Create a database in postgres that we can use for our data by entering the following command into your container;

```bash
postgres=# create database etfdb;
\c etfdb;
```

You have now created a database called `etfdb`. All of our tables and queries will be using this database. 

Add the following tables to your `etfdb` database;

```sql
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    exchange TEXT NOT NULL,
    is_etf BOOLEAN NOT NULL
);

CREATE TABLE mention (
    stock_id INTEGER,
    dt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    message TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    PRIMARY KEY (stock_id, dt),
    CONSTRAINT fk_mention_stock FOREIGN KEY (stock_id) REFERENCES stock (id)
);

CREATE INDEX ON mention (stock_id, dt DESC);
```

To create the stock records, run the following nodejs script;

```bash
> node importstocks.js
```

You now have the working data to run the main index.js example.