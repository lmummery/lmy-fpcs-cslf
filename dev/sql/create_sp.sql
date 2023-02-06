/*
 SQL file to create stored procedure to reset activity, resource and lesson tables
 */

use fpcs_cslf;

# If the procedure already exists, delete and recreate it
drop procedure if exists wipe_act_les;

delimiter //
create procedure wipe_act_les ()
begin
	delete from lesson_activity;
	delete from activity_resource;
	delete from lesson;
	delete from resource;
	delete from activity;
end //

delimiter ;