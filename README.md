In general the main idea of this repository isn't about what the project does but how it was built. 

It's a mix of some Clean Architecture **(CA)** and Domain Driven Design **(DDD)** ideas. 

## Purpose
`Why?`. Well, in my option, CRUD's are only worth it for very small projects. A simple form here or there. Other than that it's really interesting to consider the adoption of other development alternatives as creating a domain. 

The development might be different from what some devs are used to though. Instead of starting the project by the database, tables, columns, ORM and frameworks, you're gonna let all this decisions as far as possible. These are just details.

## Project
The structure follows **CA** where it emphasizes separation of concerns and the separation of software components into distinct layers. The inner layers communicates with the outer layers through interfaces.

The domain in the other hand is mostly following **DDD** with entities and value-objects. **DDD** entities has a well solid concept better than **CA**, which is too abstract imo, that's why I've chosen **DDD** entities. 

One of the coolest thing is where the framework stands. It's completely detached from my domain. So I can change from NestJS to Express, for instance, and the domain won't be affected. 

The main goal was to reach decoupling and maintainability. The code is clear to understand. Tests are simple to do. New features are easy to implement. The layers are decoupling with dependency inversion. 

Aint perfect though. There's no such a thing. But I do think the final result is pretty good.