#! /bin/sh

curl https://old.nasdaq.com/screening/companies-by-name.aspx\?letter\=0\&exchange\=nasdaq\&render\=download >> ./NASDAQ.csv
curl https://old.nasdaq.com/screening/companies-by-name.aspx\?letter\=0\&exchange\=nyse\&render\=download >> ./NYSE.csv
curl https://old.nasdaq.com/screening/companies-by-name.aspx\?letter\=0\&exchange\=amex\&render\=download >> ./AMEX.csv

