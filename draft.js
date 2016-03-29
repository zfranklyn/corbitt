var currentdate = new Date(); 
	var date = 	currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear();

// ADD USER
// This interacts with MongoDB to add a new user
function addUser(id, tel){

	// TODO:
	// integrate into ajax

	var user = new User({  id: id,
							 number: tel,
							 history: []
	                 })

	user.save(function(err,user){
		if (!err) {
			// if save successful:
			res.send({	success: 1,
						id: id, 
						tel: tel
					});
		} else {
			// if save unsuccessful
			res.send({	success: 0,
						id: id,
						tel: tel
					});
		}
	});

}

// REMOVE USER
function removeuser(id, tel){

}

// EDIT USER
// CAN EDIT: id, tel, and reminders for a specific date
function editUser(parameter, newParam, date = date ){
	if (parameter == "id"){

	} else if (parameter == "tel"){

	} else if (parameter == "r1"){

	} else if (parameter == "r2"){

	} else if (parameter == "r3"){

	} else if (parameter == "r4"){

	} else {
		res.send({	success: 0
				})
	}

	res.send({	success:1,
				parameter:parameter,
				new: newParam
			})	

}

// FIND USER in database, retrieve all information
function findUser(id){

}

// Send survey, or else remind
function sendSurvey(surveyLink, id){

}