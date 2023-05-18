import { appendFileSync } from 'fs';
import { createInterface } from 'readline';

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Person {
    constructor(name, number, email) {
        this.name = name;
        this.number = number;
        this.email = email;
    }

    saveToCSV() {
        const content = `${this.name},${this.number},${this.email}\n`;
        try {
            appendFileSync('./contacts.csv', content);
            console.log(`${this.name} Saved!`);
        } catch (err) {
            console.log(err);
        }
    }
}

const readlineAsync = (message) => {
    return new Promise(resolve => {
        readline.question(message, answer => {
            resolve(answer);
        });
    });
};

const startApp = async () => {
    const name = await readlineAsync("Contact Name: ");
    const number = await readlineAsync("Contact Number: ");
    const email = await readlineAsync("Contact Email: ");
    new Person(name, number, email).saveToCSV();
    const response = await readlineAsync("Continue? [y to continue]: ");
    if (response === 'y') {
        await startApp();
    } else {
        readline.close();
    }
};

startApp();