import mongoose from 'mongoose'

export const getDBconnection=(db_url)=>{

mongoose.connect(db_url, {useNewUrlParser:true, useUnifiedTopology:true})
mongoose.connection.once('open', ()=>console.log('connected to zuri_auth_db')).on('err', err=>console.log('error connecting to zuri_auth_db '+err))
}
