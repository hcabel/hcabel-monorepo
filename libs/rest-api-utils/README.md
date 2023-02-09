# Rest Api Utils
## Description:
Here are all the little tools that I use to create my Rest Api.

---

## Features:
### - Tree routing system

This is how it look with express JS:
```js
...
app.use('/', apiStatus);
app.use('/users', getUsers);
app.use('/users', createUsers);
app.use('/users/:id', getUsersById);
app.use('/permission', getPermission);
app.use('/permission', createPermission);
app.use('/permission/:id', getPermissionById);
app.use('/permission/:id/users', getPermissionUsers);
...
```

here is how it look with Rest Api Utils:
```js
(in a tree file)
const tree = {
	__Self__: {
		get: apiStatus,
	},
	users: {
		__Self__: {
			get: getUsers,
			post: createUsers,
		},
		":id": {
			get: getUsersById,
		}
	},
	permission: {
		__Self__: {
			get: getPermission,
			post: createPermission,
		},
		":id": {
			get: getPermissionById,
			users: {
				get: getPermissionUsers,
			}
		}
	},
}
```

#### Benefits:
- **Better readability** (at least for me, specially when you have a lot of routes)
- **Everything is in one place** (this file act as a "map" of the whole api)

#### Cons:
- **Has to be parsed with a function to be used**

#### In the future (maybe):
- **Files based** (I'm thinking about a way to use the file structure instead of a tree object)

---

## Used by:
- [**telemetry-api**](https://github.com/hcabel/hcabel-monorepo/tree/DEV/apps/backend/telemetry-api)
- [**project-api**](https://github.com/hcabel/hcabel-monorepo/tree/DEV/apps/backend/project-api)