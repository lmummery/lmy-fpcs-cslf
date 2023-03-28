# Final Project in Computer Science
#### Mx Luke Mummery

### Running the Application
1. Ensure Node.js is installed on your computer. You can download Node.js [here](https://www.nodejs.org/).

    Note: Node.js v18.12.1 was used to create the application. It is recommended to use the same version, though it _should_
work as intended on Node.js v16 or newer

2. Ensure MySQL is installed on your computer. You can download MySQL Community Server [here](https://dev.mysql.com/downloads/mysql/).

3. Download and extract the code from the _master_ branch.

4. In MySQL Workbench, or the MySQL Terminal, navigate to the project root folder and run:

    ```
   source dev/sql/create_db.sql;
   source dev/sql/add_tables.sql;
   source dev/sql/create_sp.sql;
   source dev/sql/create_views.sql;
    ```
   This will initialise the database on your local MySQL server.

5. In a new Command Prompt (Windows) or Terminal (macOS) window, navigate to the project root folder, for example:
    ```
   cd C:\Users\lukemummery\Downloads\The-Downloaded-Project
   ```

6. Run ```npm install``` to install the Node dependencies
7. Run ```node index.js``` to start the application
8. In a web browser, navigate to [http://localhost:8000/](http://localhost:8000/)