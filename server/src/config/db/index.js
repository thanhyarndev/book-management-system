const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

async function connetct (){
    try {
        await mongoose.connect('mongodb+srv://3122410008:123123123@clothes-project.tvwyy.mongodb.net/BMS?retryWrites=true&w=majority&appName=BMS');
        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect failure!!!')
    }
}
module.exports = {connetct}

