const Hapi = require('hapi')
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./schema/User')

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('database is connected'))
  .catch(err => console.log(err))

const init = async () => {
  //Init server
  const server = new Hapi.server({
    port: 8000,
    host: 'localhost'
  })

  await server.register(require('inert'))
  await server.register(require('vision'))

//Create User
server.route({
	method: 'POST',
	path: '/api/user',
	handler: async (request, h) => {
		let user = request.payload;
		console.log(user);
		let newInfo = new User(user);
		await newInfo.save((err, task) => {
			if (err) return console.log(err);
		})
		return h.response("Success");
	}
});

//Get  Users
server.route({
  method: 'GET',
  path: '/api/user',
  handler: async (request, h) => {
      let params = request.query
      let user = await User.find(params).lean();
      return h.response(user);
  }
});

//Update User
server.route({
  method: 'PUT',
  path: '/api/user/{id}',
  handler: async (request, h) => {
      let params = request.params.id;
      let payload = request.payload;
      let user = await User.updateOne({ _id: params }, payload).lean();
      return h.response(user);
  }
});


//Delete User
server.route({
  method: 'DELETE',
  path: '/api/user/{id}',
  handler: async (request, h) => {
      let params = request.params.id;
      let user = await User.remove({ _id: params });
      return h.response(user);
  }
});






  await server.start()

  console.log(`Server is running on ${server.info.uri}`)
}

init().catch(err => console.log(err))
