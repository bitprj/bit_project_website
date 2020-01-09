
const express = require('express')
const path = require('path')
require('../db/mongoose')
const Event = require('../models/events')
const router = new express.Router()

app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// REST APIs

// Routes to add event
router.post('/events', async (req, res) =>{
    const event = new Event(req.body)
	event.href = "/events/view?eventName=" + event.eventName
    try { 
    	await event.save()
    	res.status(201).redirect('/events')
    } catch(e) {
        res.status(400).send(e)
    }
})

// Routes to singular event view
router.get('/events/view', async (req, res) => { 
	console.log('req.query.eventName=' + req.query.eventName)
	try { 
		if (req.query.eventName) { 
			const events = await Event.find({"eventName":req.query.eventName})
			res.render('view', {
				events: events
			})
		}
		else { 
			console.log('redirecting, no event specified')
			//res.status(201).redirect('/events')
		}
	} catch (e) { 
		res.status(500).send(e)
	}
})

// Routes to Events Browsing Page
router.get('/events', async (req, res) => { 
	try { 
		const events = await Event.find({})
		// Render "events.hbs" with const events
		res.render('events', {
			events: events
		})
	} catch (e) { 
		res.status(500).send(e)
	}
})


// Read ALL events
// Added functionality, if url has eventName search parameter, fitlers for that event name
router.get('/event', async (req, res) => { 
	//Create variable to store filter
	var query = {}
	// TODO: Link search bar button to actually retrive it upon searching
	try { 
		if (req.query.eventName) { 
			query.eventName = req.query.eventName
			const events = await Event.find({"eventName":query.eventName})
			res.render('events', {
				events: events
			})
		} else { 
			console.log('sending all events')
			const events = await Event.find({})
			res.send(events)
		}
	} catch (e) { 
		res.status(500).send()
	}
})


// TODO: Read SINGLE event
// Silenced because it was being used before /events/:eventName
// router.get('/event/:id', async (req, res) => { 
//     const _id = req.params.id

//     console.log(_id)
// 	try {
// 		const event = await Event.findById(_id)

// 		// if not found return 404 error
// 		if (!event) { 
// 			return res.status(404).send()
// 		}

// 		// if found send user
// 		res.send(event)
// 	//send 500 error if error
// 	} catch(e) { 
// 		res.status(500).send(e)
// 	}
// })
 
// TODO: Delete Event
router.delete('/events/:id', async (req, res) => {  
	try {
		const _id = "5e15245a5df7d716144a41c7"
		//const _id = req.params.id.
		console.log(req.params.id)
		console.log(_id)
		// try to delete Event, if found store in Event 
		const event = await Event.findByIdAndDelete(_id)
		console.log(event)
		// if not found return 404 error
		if (!event) { 
			return res.status(404).send()
		}

		// if found send user
		res.send(event)
	//send 500 error if error
	} catch(e) { 
		res.status(500).send()
	}
})



// TODO: Update Event
router.patch('/events/:id', async (req, res) => { 
	const updates = Object.keys(req.body) 
	const allowedUpdates = ['firstName', 'lastName', 'age', 'email', 'password','eventCount', 'isCoordinator','assignedToEvent']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) { 
		return res.status(400).send({error: 'Invalid update'})
	}


	try { 
		//spot to fix
		const Admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
		//spot to fix findByIdAndUpdate({_id: req.params.id }, req.body, { new: true, runValidators: true})
		if (!Admin) { 
			return res.status(404).send()
		}

		res.send(Admin)
	} catch (e) {  
		res.status(400).send()
	}
})

// Export Admin router
module.exports = router