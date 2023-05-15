--1
CREATE OR REPLACE FUNCTION trigger_update_curr_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table users(id serial primary key,
				  name varchar(150) not null,
				  email_id varchar unique not null,
				  password text not null,
				  created_at timestamp default now(),
				  updated_at timestamp default now()
				  )
				 -- drop table users
create index users_id on users(id);

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_curr_timestamp();

create extension pgcrypto;
--select table users

--2.a
CREATE OR REPLACE FUNCTION get_users()
RETURNS json
AS $$
DECLARE
json_out JSON;
BEGIN
	SELECT json_agg(row_to_json(a)) INTO json_out FROM (select * from users order by id) a;
RETURN json_out;
END;
$$ language plpgsql;

-- select get_users()

--2.b
CREATE OR REPLACE FUNCTION insert_data(
	json_data json)
    RETURNS json
    LANGUAGE 'plpgsql'
AS $$ 
DECLARE
json_return JSON := '{"status": 200, "message": ""}';
BEGIN
	IF EXISTS(SELECT * FROM users WHERE email_id = CAST(json_data ->> 'email_id' AS varchar)) THEN
		json_return :='{"status": 403, "message": "Attempting to add duplicate emails" }';
	ELSE
		INSERT INTO users(name, email_id, password)
		VALUES(CAST(json_data ->> 'name' AS varchar), 
			   CAST(json_data ->> 'email_id' AS varchar), 
			   crypt(CAST(json_data ->> 'password' AS text),gen_salt('bf')));
		json_return :='{"status": 200, "message": "User created successfully"}';
	END IF;
	RETURN json_return;
EXCEPTION
WHEN OTHERS THEN
json_return := '{"status": 400, "message": "Failed to add user';
RETURN json_return;
END;
$$ 

--2.c
CREATE OR REPLACE FUNCTION update_user(json_data JSON)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
json_return JSON := '{"status": 200, "message": ""}';
update_sql varchar;
BEGIN
	IF NOT EXISTS(SELECT * FROM users WHERE ID = CAST(json_data ->> 'id' AS int)) THEN
		json_return := '{"status": 403, "message": "UserId '||CAST(json_data ->> 'id' AS int)||' does not exist"}';
	ELSIF EXISTS(SELECT * FROM users WHERE email_id = CAST(json_data ->> 'email' AS varchar) and ID != CAST(json_data ->> 'id' AS int)) THEN
		json_return :='{"status": 403, "message": "Attempting to add duplicate emails" }';	
	ELSE
		UPDATE users SET NAME = CAST(json_data ->> 'name' AS varchar),
						email_id = CAST(json_data ->> 'email' as varchar)
						 WHERE ID = CAST(json_data ->> 'id' AS int);
		json_return :='{"status": 200, "message":' ||'"successfully updated user '|| CAST(json_data ->> 'id' AS int)||'" }';			
	END IF;	
	RETURN json_return;
EXCEPTION
WHEN OTHERS THEN
	json_return := '{"status": 400, "message": "Failed to update user"}';
	RETURN json_return;
END;
$$ 

--select update_user(json_build_object('id',9,'name','x'));

--2.d
CREATE OR REPLACE FUNCTION delete_user(p_email_id varchar)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
json_return JSON;
BEGIN
	DELETE FROM users WHERE email_id = p_email_id;
	json_return :='{"status": "200", "message":' ||'"successfully deleted user '||p_email_id||'" }';
	RETURN json_return;
EXCEPTION
WHEN OTHERS THEN
json_return := '{"status": "401", "message": "Failed to edit user"}';
RETURN json_return;
end;
$$

--select delete_user(2);

--2.e
CREATE OR REPLACE FUNCTION get_user(p_id int)
RETURNS json
AS $$
DECLARE
json_return JSON;
BEGIN
	SELECT row_to_json(users) INTO json_return FROM users WHERE ID = p_id;
	IF(json_return IS  null) THEN
	json_return := '{"status": "200", "message": "user with User Id '||p_id||' does not exist"}';
	END IF;
	RETURN json_return;
EXCEPTION
WHEN OTHERS THEN
json_return := '{"status": "401", "message": "Failed to get user"}';
RETURN json_return;
END;
$$ LANGUAGE plpgsql;

--select get_user(7);

--DECRYPTION
SELECT * FROM users 
    WHERE password is NOT NULL 
      AND password = crypt('dutta',password);

--Update user password
CREATE OR REPLACE FUNCTION update_user_password(json_data JSON)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
json_return JSON := '{"status": 200, "message": ""}';
update_sql varchar;
BEGIN
	IF NOT EXISTS(SELECT * FROM users WHERE ID = CAST(json_data ->> 'id' AS int)) THEN
		json_return := '{"status": 403, "message": "UserId '||CAST(json_data ->> 'id' AS int)||' does not exist"}';
	ELSE
		UPDATE users SET PASSWORD = crypt(CAST(json_data ->> 'password' AS text),gen_salt('bf'))
						 WHERE ID = CAST(json_data ->> 'id' AS int);
		json_return :='{"status": 200, "message":' ||'"successfully updated password of user '|| CAST(json_data ->> 'id' AS int)||'" }';			
	END IF;	
	RETURN json_return;
EXCEPTION
WHEN OTHERS THEN
	json_return := '{"status": 400, "message": "Failed to update password"}';
	RETURN json_return;
END;
$$ 