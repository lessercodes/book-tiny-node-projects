import { appendFileSync } from 'fs';
import prompt from 'prompt';

prompt.message = '';
prompt.start();

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

const startApp = async () => {
    const {name, number, email} = await prompt.get([{
            name: 'name',
            description: 'Contact Name',
        },{
            name: 'number',
            description: 'Contact Number',
        },{
            name: 'email',
            description: 'Contact Email',
        },
    ]);

    new Person(name, number, email).saveToCSV();

    const {again} = prompt.get([{
        name: 'again',
        description: 'Continue? [y to continue]',
    },]);

    if (again === 'y') {
        await startApp();
    }
};

startApp();