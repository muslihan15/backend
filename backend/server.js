const express=require('express');
const multer=require('multer');
const cors=require('cors');
const sqlite3=require('sqlite3').verbose();
const path=require('path');
const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const db=new sqlite3.Database('absensi.db');
db.run(`CREATE TABLE IF NOT EXISTS absensi(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 nama TEXT,nim TEXT,kelas TEXT,foto TEXT,waktu TEXT
)`);

const storage=multer.diskStorage({
 destination:(req,file,cb)=>{cb(null,'uploads')},
 filename:(req,file,cb)=>{cb(null,Date.now()+'-'+file.originalname)}
});
const upload=multer({storage});

app.post('/absen', upload.single('foto'), (req,res)=>{
 const {nama,nim,kelas}=req.body;
 const foto=req.file.filename;
 const waktu=new Date().toISOString();
 db.run(`INSERT INTO absensi(nama,nim,kelas,foto,waktu) VALUES(?,?,?,?,?)`,
  [nama,nim,kelas,foto,waktu]);
 res.json({success:true});
});

app.get('/absen',(req,res)=>{
 db.all(`SELECT * FROM absensi`,[],(e,r)=>res.json(r));
});

app.listen(3000,()=>console.log('Running'));
