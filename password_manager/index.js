import bcrypt from 'bcrypt';
import promptModule from 'prompt-sync';
import { MongoClient } from 'mongodb';

let authCollection = null;
let passwordsCollection = null;
let hasPassword = false;

const client = new MongoClient('mongodb://localhost:27017', {
    auth: {
        username: 'pmuser',
        password: 'pmpass',
    },
});
const dbName = 'passwordManager';
const prompt = promptModule();

const saveNewPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    await authCollection.insertOne({ type: 'auth', hash });
    console.log(`Password has been saved!`);
    showMenu();
};

const compareHashedPasswords = async (password) => {
    const { hash } = await authCollection.findOne({ type: 'auth' });
    return await bcrypt.compare(password, hash);
};

const promptNewPassword = async () => {
    const response = prompt('Enter a main password: ');
    await saveNewPassword(response);
};

const promptOldPassword = async () => {
    const response = prompt('Enter your password: ');
    const result = await compareHashedPasswords(response);
    if (result) {
        console.log('Password verified');
        showMenu();
    } else {
        console.log('Password incorrect');
        promptOldPassword();
    }
};

const showMenu = async () => {
    console.log(`
     1. View passwords
     2. Manage new password
     3. Verify password
     4. Exit
    `);
    const response = prompt('> ');

    if (response === '1') await viewPasswords();
    else if (response === '2') await promptManageNewPassword();
    else if (response === '3') promptOldPassword();
    else if (response === '4') process.exit();
    else {
        console.log(`That's an invalid response`);
        showMenu();
    }
};

const viewPasswords = async () => {
    const passwords = await passwordsCollection.find({}).toArray();
    Object.entries(passwords).forEach(([key, value], index) => {
        console.log(`${index + 1}. ${key} => ${value}`);
    });
    showMenu();
};

const promptManageNewPassword = async () => {
    const source = prompt('Enter name for password: ');
    const password = prompt('Enter password to save: ');
    await passwordsCollection.findOneAndUpdate(
        { source },
        { $set: { password } },
        {
            returnNewDocument: true,
            upsert: true,
        }
    );
    console.log(`Password for ${source} has been saved!`);
    showMenu();
};

const initDB = async () => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    authCollection = db.collection('auth');
    passwordsCollection = db.collection('passwords');
    const hashedPassword = await authCollection.findOne({ type: 'auth' });
    hasPassword = hashedPassword;
};

const start = async () => {
    await initDB();
    if (!hasPassword) {
        promptNewPassword();
    } else {
        promptOldPassword();
    }
};

await start();
