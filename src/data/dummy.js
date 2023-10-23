import avatar from './avatar.jpg';
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';

export const employeesData = [
    {
        EmployeeID: 1,
        Name: 'Nancy Davolio',
        Title: 'Sales Representative',
        HireDate: '01/02/2021',
        Country: 'USA',
        ReportsTo: 'Carson',
        EmployeeImage: avatar3,
    },
    {
        EmployeeID: 2,
        Name: 'Nasimiyu Danai',
        Title: 'Marketing Head',
        HireDate: '01/02/2021',
        Country: 'USA',
        ReportsTo: 'Carson',
        EmployeeImage: avatar3,
    },
    {
        EmployeeID: 3,
        Name: 'Iulia Albu',
        Title: 'HR',
        HireDate: '01/02/2021',
        Country: 'USA',
        ReportsTo: 'Carson',
        EmployeeImage: avatar4,
    },
    {
        EmployeeID: 4,
        Name: 'Siegbert Gottfried',
        Title: 'Marketing Head',
        HireDate: '01/02/2021',
        Country: 'USA',
        ReportsTo: 'Carson',
        EmployeeImage: avatar2,
    },
    {
        EmployeeID: 5,
        Name: 'Omar Darobe',
        Title: 'HR',
        HireDate: '01/02/2021',
        Country: 'USA',
        ReportsTo: 'Carson',
        EmployeeImage: avatar,
    },
];
const gridEmployeeProfile = (props) => (
    <div className="flex items-center gap-2">
        <img className="rounded-full w-10 h-10" src={props.EmployeeImage} alt="employee" />
        <p>{props.Name}</p>
    </div>
);

export const employeesGrid = [
    { headerText: 'Employee', width: '150', template: gridEmployeeProfile, textAlign: 'Center' },
    { field: 'Name', headerText: '', width: '0', textAlign: 'Center' },
    { field: 'Title', headerText: 'Designation', width: '170', textAlign: 'Center' },
    { headerText: 'Country', width: '120', textAlign: 'Center', template: gridEmployeeCountry },

    { field: 'HireDate', headerText: 'Hire Date', width: '135', format: 'yMd', textAlign: 'Center' },

    { field: 'ReportsTo', headerText: 'Reports To', width: '120', textAlign: 'Center' },
    { field: 'EmployeeID', headerText: 'Employee ID', width: '125', textAlign: 'Center' },
];
