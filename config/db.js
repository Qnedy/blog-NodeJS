if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: "mongodb+srv://qnedy:Esquec1kkk@cluster0-os8wu.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {
        mongoURI: "mongodb://localhost/blogapp"
    }
}