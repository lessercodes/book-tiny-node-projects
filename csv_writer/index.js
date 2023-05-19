import {createObjectCsvWriter} from 'csv-writer';
import prompt from 'prompt';

const csvWriter = createObjectCsvWriter({
    path: './contacts.csv',
    header: [
        { id: 'name', title: 'NAME' },
        { id: 'number', title: 'NUMBER' },
        { id: 'email', title: 'EMAIl' },
    ],
});

prompt.message = '';
prompt.start();

class Person {
    constructor(name, number, email) {
        this.name = name;
        this.number = number;
        this.email = email;
    }

    async saveToCSV() {
        try {
            const { name, number, email } = this;
            await csvWriter.writeRecords([{ name, number, email }]);
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

    await new Person(name, number, email).saveToCSV();

    const {again} = await prompt.get([{
        name: 'again',
        description: 'Continue? [y to continue]',
    },]);

    if (again === 'y') {
        await startApp();
    }
};

startApp();