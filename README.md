

# SmartCart

## Running frontend

    cd frontend
    npm install --legacy-peer-deps
    npx expo start
## Running tests

    cd frontend
    npm test

## Data Model

 The data in the backend is stored in a Google Cloud Firestore database. Cloud Firestore structures data similar to a JSON file - Objects of the same class are called **Documents** (value) and they are stored inside of **Collections** (key). Each Collection can also store **Subcollections** that can themselves store either more Documents or more Subcollections.
 
The data model found in *frontend/firebase/model* encapsulates the different classes used in SmartCart. Each class correlates to some Collection in Firestore and contains the parameters necessary for the creation of each Document in that Collection. More importantly, the data model exposes functions that will, as of right now, create, get, update, and delete these collections from Firestore. This is done by simply calling the function and passing in either a collection ID or a local object of the corresponding class, depending on the function. For testing purposes, the functions also allow for a local db to be passed in (ignore this paramater when using the functions). More functions should be added to the data model as needed.

i.e. a User can be created as follows:

    const  newUser  =  new  User(name, email, phoneNumber, user.uid);
    const  docRef  =  await  User.createUser(newUser);


 `docRef` will now have the `id` paramater (`docRef.id`) containing the collection ID of the created User.
