// =======================================
// Puerto
// =======================================

process.env.PORT = process.env.PORT || 3000


// =======================================
// Entorno
// =======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// =======================================
// Caducidad y Seed
// =======================================
process.env.CADUCIDAD_TOKEN = '48h'
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'



// =======================================
// DB
// =======================================
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB


// =======================================
// Google client
// =======================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '279681369346-qa7qj4nqu2ivfmferm6t1ofaeiir2neu.apps.googleusercontent.com'