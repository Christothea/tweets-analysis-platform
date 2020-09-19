/*
* Data Store Options
* Wraps the information required to setup a basic database connection
*
*/
export class DataStoreOptions {
    /*
    * Database server Host (name or IP)
    */
    public host?: string;

    /*
    * Database server Port number
    */
    public port?: number;

    /*
    * Database Name
    */
    public database?: string;
}
