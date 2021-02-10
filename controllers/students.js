const fs = require('fs')
const data = require ('../data.json')
const { age, graduation, date } = require('../utils')

//Index
exports.index = function(req, res){

    const students = []
    
    for (i in data.students){ 
        const student = {
            ...data.students[i],
            subjects: data.students[i].subjects.split(",")
        }
        
        students.push(student)
    } 
    
    return res.render("students/index", { students })

}


//Create
exports.create = function(req, res){
    return res.render("students/formulario")
}

//Post
exports.post = function (req,res) {

    const keys = Object.keys(req.body)

    //Checando campos vazios
    for (key of keys){
        if (req.body[key]=="") {
            return res.send ('Please, fill in all the fields')
        }
    }

    let { avatar_url, birth, name, degree, type, subjects} = req.body

    birth = Date.parse(req.body.birth)
    created_at = Date.now()
    id = Number (data.students.length + 1)

    data.students.push({
        id,
        avatar_url,
        birth,
        name,
        degree,
        type,
        subjects,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error")

    })
    
    return res.redirect("/students")
}

//Show
exports.show = function(req,res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) {
        return res.send("Student not found !")
    }

    const student = {
        ...foundStudent,
        age: age(foundStudent.birth),
        degree: graduation(foundStudent.degree),
        subjects: foundStudent.subjects.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundStudent.created_at)
    }

    return res.render("students/show", {student})
}

//Edit
exports.edit = function(req,res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) {
        return res.send("Student not found !")
    }

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth)
    }
    
    return res.render('students/edit', { student })
}

//PUT
exports.update = function(req,res) {
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) {
        return res.send("Student not found !")
    }

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.students[index] = student

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err) {
        if(err) {
            return res.send("Write error!")
        }
        return res.redirect(`/students/${id}`)
    })
}

//DELETE
exports.delete = function(req,res) {
    const { id } = req.body

    //So entra dentro do filteredInstructors o que a funcao retornar como true e tira o que retorna false
    const filteredStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect("/students")
    })
}