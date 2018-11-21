let db = require('../models');


// function deepEquals(thing1, thing2) {
//   const keys = Object.keys(thing1) // ['foo', 'baz']

//   for (key of keys) {
//     console.log(key) // 'firstName'
//     const prop1 = thing1[key] // 'John'
//     const prop2 = thing2[key] // 'John'

//     const type1 = typeof prop1 // 'string'
//     const type2 = typeof prop2  // 'string'
    
//     if (type1 !== type2) return false
    
//     if (type1 !== 'object') {
//       return prop1 === prop2 // value equality
//     }
    

//     return deepEquals(prop1, prop2)
//   }
// }

//deepEquals({foo: 'bar', baz: 'qux'}, {foo: 'bar'})

// deepEquals({
//   firstName: 'John', 
//   lastName: 'Smith',
//   private: {
//     ssn: "111-22-3456"
//   }
// }, 
// {
//   firstName: 'John', 
//   lastName: 'Smith',
//   private: {
//     ssn: "111-22-3457"
//   }
// })

module.exports = function routes(app) {

  // function testReturn(expected, given) {

  //   let aKeys = Object.keys(expected)
  //   let aKeystransformed = JSON.stringify(aKeys)

  //   let bKeys = Object.keys(given[0].dataValues)
  //   let bKeystransformed = JSON.stringify(bKeys)

  //   if (aKeystransformed === bKeystransformed){
  //     console.log('Object is expected')
  //   }
  //   else{
  //     throw new Error('Return object is inaccurate')
  //   }  
  // }


  // function heartbeat() {
  //   let testdata = {
  //     id: 1,
  //     name: 'dog',
  //     subject: 'dog',
  //     createdAt: 'time',
  //     updatedAt: 'time'
  //   }
  //   return testdata

  // }


  app.get('/heartbeat/:id', (request, response) => {

    //If you can't use ES7 Async with express, you can't prevent the response to run after the promise is fulfilled because it has to be nested within the route

    db.Test.findAll({   
        where: {
          id: request.params.id
        }
    }).then((res) => {

      //Our check 
      // testReturn(heartbeat(), res)

      response.json(
        res
      )

    })
  });


  app.post('/exists', (request, response) => {

    db.Test.create({
      name: request.body.name,
      subject: request.body.subject
    }).then(res => response.send('All good'))



  })

  app.put('/update/:id', (request, response) => {

    db.Test.update({
      name: request.body.name,
      subject: request.body.subject
    }, {
        where: {
          id: request.params.id
        }
      }).then(res => response.send('All good'))


  })

  app.delete('/remove/:id', (request, response) => {

    db.Test.destroy({
      where: {
        id: request.params.id
      }
    }).then(res => response.send('All good'))


  })


}