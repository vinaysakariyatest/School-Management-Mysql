var express=require('express');
var bodyparser=require('body-parser');
var mysql=require('mysql');
const { render } = require('ejs');

var app= express();

var con =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'school'
})
con.connect()

app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({extended:false}));

var school=""
var user_name=""
// School Login
app.get('/schooldashboard',function(req,res){

        res.render('schooldashboard');
})

app.get('/',function(req,res){
    if(school==""){
        res.render('school_login')
    }
    else{
        res.redirect('/schooldashboard')
    }
})

app.post('/',function(req,res){
    var email=req.body.email
    var password=req.body.password

    var qr="select * from school_login where email='"+email+"' and password='"+password+"'"
    con.query(qr,function(error,result,index){
        if(result.length==1){
            res.redirect('/schooldashboard')
        }
        else{
            res.redirect('/')
        }
    })
})

// Add Staff
app.get('/addstaff',function(req,res){
    res.render('add_staff')
})

app.post('/addstaff',function(req,res){
    var name=req.body.sname
    var city=req.body.city
    var email=req.body.email
    var password=req.body.password

    var qr="insert into staff (name,city,email,password) values('"+name+"','"+city+"','"+email+"','"+password+"')"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/addstaff')
    })
    
})

// Add Student
// app.get('/addstudent',function(req,res){
//     res.render('add_student')
// })

app.get('/addstudent',function(req,res){
    // var qr="select * from standard"
    var qr="SELECT standard.std AS std, division.division FROM standard LEFT JOIN division ON standard.id = division.id;"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('add_student',{result})
    })
})


app.post('/addstudent',function(req,res){
    var rno=req.body.rno
    var name=req.body.name
    var std=req.body.std
    var division=req.body.division

    var qr="insert into student (rno,namestandard,division) values('"+rno+"','"+name+"','"+mobile+"','"+std+"','"+division+"')"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/addstudent')
    })
})

// Add Result
app.get('/addresult/:id',function(req,res){
    var id=req.params.id
    var qr="select * from student where id="+id;

    con.query(qr,function(error,result,index){
      if(error) throw error
      res.render('add_result',{result})  
    })
})


app.post('/addresult/:id',function(req,res){
    // var id=req.params.id
    var rno=req.body.rno
    var sname=req.body.student
    var std=req.body.std
    var division=req.body.division
    var guj=parseInt(req.body.guj)
    var eng=parseInt(req.body.eng)
    var maths=parseInt(req.body.maths)
    var hindi=parseInt(req.body.hindi)
    var sci=parseInt(req.body.sci)
    var total=parseInt(guj+eng+maths+hindi+sci)
    var avg=total/5;

    var query="insert into result (rno,sname,std,division,guj,eng,maths,hindi,science,total,avg) values('"+rno+"','"+sname+"','"+std+"','"+division+"','"+guj+"','"+eng+"','"+maths+"','"+hindi+"','"+sci+"','"+total+"','"+avg+"')"

    con.query(query,function(error,result,index){
        if(error) throw error
        res.redirect('/view_result')
    })

})

// View Result
app.get('/view_result',function(req,res){
    var query="select * from result"
    con.query(query,function(error,result,index){
        if(error) throw error
        res.render('view_result',{result})
    })
})

// View Staff
app.get('/viewstaff',function(req,res){
    var qr="select * from staff"
    con.query(qr,function(error,result,index){
        if(error) throw error
            res.render('view_staff',{result})
    })
    
})

// View Student
app.get('/viewstudent',function(req,res){
    var query="SELECT standard.std AS std, division.division FROM standard LEFT JOIN division ON standard.id = division.id;"
    // var query="select * from student"
    con.query(query,function(error,result,index){
    
        if(error) throw error
        res.render('view_student',{result})
    })
})

app.post('/viewstudent',function(req,res){
    var std=req.body.std
    var division=req.body.division

    var qr="select * from student where standard='"+std+"' and division='"+division+"'"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('search_student',{result})
        // console.log(result)
    })
})

// Add Standard
app.get('/addstd',function(req,res){
    res.render('add_std')
})

app.post('/addstd',function(req,res){
    var std=req.body.std

    var qr="insert into standard(std) values('"+std+"')"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/addstd')
    })
})

// Add Division
app.get('/adddiv',function(req,res){
    res.render('add_division')
})

app.post('/adddiv',function(req,res){
    var division=req.body.division
    
    var qr="insert into division(division) values('"+division+"')"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/adddiv')
    })
})

/*=====================================================
Staff Login
=======================================================*/ 
app.get('/stafflogin',function(req,res){
    if(school==""){
        res.render('staff_login')
    }
    else{
        res.redirect('/staffdashboard')
    }
})

app.get('/staffdashboard',function(req,res){
    res.render('staff_dashboard',{user_name})
})

app.post('/stafflogin',function(req,res){
    var email=req.body.email
    var password=req.body.password

    var qr="select * from staff where email='"+email+"' and password='"+password+"'"
    con.query(qr,function(error,result,index){
        if(result.length==1){
            res.redirect('/staffdashboard')
        }
        else{
            res.redirect('/stafflogin')
        }
    })
})

// View Student
app.get('/staffstudent',function(req,res){
    var query="select * from student"
    con.query(query,function(error,result,index){
        if(error) throw error
        res.render('staff_student',{result})
    })
})

// View Result
app.get('/viewresult/:rno',function(req,res){
    var rno=req.params.rno
    var query="select * from result where rno="+rno
    con.query(query,function(error,result,index){
        if(error) throw error
        res.render('staff_result',{result})
        // console.log(result)
    })
})

// Update Result
app.get('/update/:rno',function(req,res){
    var rno = req.params.rno
    var qr="select  * from result where rno="+rno

    con.query(qr,function(error,result,index){
        res.render('update_result',{result})
    })
})


app.post('/update/:rno',function(req,res){
    var rno=parseInt(req.params.rno)
    var name=req.body.student
    var std=parseInt(req.body.std)
    var division=req.body.division
    var guj=parseInt(req.body.guj  )  
    var eng=parseInt(req.body.eng)
    var maths=parseInt(req.body.maths)
    var hindi=parseInt(req.body.hindi)
    var science=parseInt(req.body.sci)
    var total=parseInt(guj+eng+maths+hindi+science)
    var per=total/5

    var qr="update result set rno='"+rno+"',sname='"+name+"',std='"+std+"',division='"+division+"',guj='"+guj+"',eng='"+eng+"',hindi='"+hindi+"',science='"+science+"' where rno="+rno
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/staffstudent')
    })
})
/*========================================================
Student
==========================================================*/
app.get('/student',function(req,res){
    var query="SELECT standard.std AS std, division.division FROM standard LEFT JOIN division ON standard.id = division.id;"
    con.query(query,function(error,result,index){
    
        if(error) throw error
        res.render('findresult',{result})
    })
})
app.post('/student',function(req,res){
    var std=req.body.std
    var division=req.body.division
    var rno=req.body.rno

    var qr="SELECT * FROM result WHERE std = '"+std+"' AND division = '"+division+"' AND rno = '"+rno+"';"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('studentfind_result',{result})
        // console.log(result)
    })
})
app.listen(1000)