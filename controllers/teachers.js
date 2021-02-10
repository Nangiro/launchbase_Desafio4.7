const fs = require('fs')
const data = require ('../data.json')
const { age, graduation, date } = require('../utils')

//Index
exports.index = function(req, res){

    const teachers = []
    
    for (i in data.teachers){ 
        const teacher = {
            ...data.teachers[i],
            subjects: data.teachers[i].subjects.split(",")
        }
        
        teachers.push(teacher)
    } 
    
    return res.render("teachers/index", { teachers })

}


//Create
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
    id = Number (data.teachers.length + 1)

    data.teachers.push({
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
    
    return res.redirect("/teachers")
}

//Show
exports.show = function(req,res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })

    if (!foundTeacher) {
        return res.send("Teacher not found !")
    }

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        degree: graduation(foundTeacher.degree),
        subjects: foundTeacher.subjects.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
    }

    return res.render("teachers/show", {teacher})
}

//Edit
exports.edit = function(req,res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })

    if (!foundTeacher) {
        return res.send("Teacher not found !")
    }

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth)
    }
    
    return res.render('teachers/edit', { teacher })
}

//PUT
exports.update = function(req,res) {
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex) {
        if (id == teacher.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundTeacher) {
        return res.send("Teacher not found !")
    }

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err) {
        if(err) {
            return res.send("Write error!")
        }
        return res.redirect(`/teachers/${id}`)
    })
}

//DELETE
exports.delete = function(req,res) {
    const { id } = req.body

    //So entra dentro do filteredInstructors o que a funcao retornar como true e tira o que retorna false
    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json",JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect("/teachers")
    })
}