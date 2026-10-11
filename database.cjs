'use strict';
const {DatabaseSync}=require('node:sqlite');
function createDatabase(filename){
 const url=process.env.TURSO_DATABASE_URL;
 if(process.env.RENDER&&!url)throw Error('TURSO_DATABASE_URL is required on Render; refusing temporary local storage.');
 if(url&&!process.env.TURSO_AUTH_TOKEN)throw Error('TURSO_AUTH_TOKEN is required for cloud storage.');
 const remote=!!url;
 const client=remote?require('@libsql/client/http').createClient({url,authToken:process.env.TURSO_AUTH_TOKEN}):new DatabaseSync(filename);
 const rows=result=>result.rows.map(row=>Object.fromEntries(result.columns.map((column,i)=>[column,row[i]])));
 return {
  remote,
  async exec(sql){if(remote)return client.executeMultiple(sql);return client.exec(sql);},
  prepare(sql){return {
   async get(...args){if(remote)return rows(await client.execute({sql,args}))[0];return client.prepare(sql).get(...args);},
   async all(...args){if(remote)return rows(await client.execute({sql,args}));return client.prepare(sql).all(...args);},
   async run(...args){if(remote){const r=await client.execute({sql,args});return {changes:r.rowsAffected,lastInsertRowid:r.lastInsertRowid};}return client.prepare(sql).run(...args);}
  };},
  async batch(statements){if(remote)return client.batch(statements,'write');client.exec('BEGIN IMMEDIATE');try{const result=statements.map(s=>client.prepare(s.sql).run(...(s.args||[])));client.exec('COMMIT');return result;}catch(e){client.exec('ROLLBACK');throw e;}},
  close(){return client.close();}
 };
}
module.exports={createDatabase};
