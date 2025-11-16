-- CREATE TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

-- LOAD DATAS
INSERT INTO accounts 
    (account_number, name, amount, type)
VALUES
    (1, 'Johns Checking', 1000, 'checking'),
    (2, 'Janes Savings', 2000, 'savings'),
    (4, 'Bobs Checking', 40000, 'checking'),
    (5, 'Bills Savings', 50000, 'savings'),
    (7, 'Nancy Checking', 70000, 'checking'),
    (8, 'Nancy Savings', 80000, 'savings');

INSERT INTO accounts
    (account_number, name, amount, type, credit_limit)
VALUES
    (3, 'Jills Credit', -3000, 'credit', 3500),
    (6, 'Bills Credit', -60000, 'credit', 60000),
    (9, 'Nancy Credit', -90000, 'credit', 100000);

DROP TABLE IF EXISTS transaction_history;
CREATE TABLE transaction_history (
    id INTEGER PRIMARY KEY,
    account_number INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    transaction_time TEXT NOT NULL,
    CONSTRAINT fk_account_number
        FOREIGN KEY (account_number)
        REFERENCES accounts (account_number)
);

ALTER TABLE transaction_history ADD CONSTRAINT verify_type
CHECK (type IN ('deposit', 'withdrawal'));

ALTER TABLE transaction_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME id_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);