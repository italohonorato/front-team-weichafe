import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Assistance } from 'src/app/interfaces/assistance';
import { Sections } from 'src/app/interfaces/sections';
import { User } from 'src/app/interfaces/user';
import { UserDoc } from 'src/app/models/user/user-doc';
import { AssistanceService } from 'src/app/services/firestore/assistance/assistance.service';
import { SectionsService } from 'src/app/services/firestore/sections/sections.service';
import { UsersService } from 'src/app/services/firestore/users/users.service';
import { UtilService } from 'src/app/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-query-assistance',
  templateUrl: './query-assistance.component.html',
  styleUrls: ['./query-assistance.component.css']
})
export class QueryAssistanceComponent implements OnInit {

  getAllUsersSubscription: Subscription;
  usersList: User[];
  assistanceList: Assistance[];
  studentsBySection: UserDoc[];
  sections: Sections[] = new Array<Sections>();
  displayedColumns: string[] = ['select', 'position', 'name', 'lastName', 'run', 'email', 'dob', 'section'];
  dataSource;
  selectedUser: UserDoc;
  selection = new SelectionModel<UserDoc>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Form
  assistanceForm = this.formBuilder.group({
    assistanceDate: ['', Validators.required],
    section: [[], Validators.required]
  });
  // Getters assistanceForm
  get assistanceDate() { return this.assistanceForm.get('assistanceDate') }
  get section() { return this.assistanceForm.get('section') }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private utilService: UtilService,
    private sectionsService: SectionsService,
    private assistanceService: AssistanceService
  ) { }

  ngOnInit() {
    this.getAllSections();
  }

  getAllSections() {
    this.sectionsService.getAllSections().subscribe(snapshot => {
      this.sections = snapshot.map(data => {
        let unknownObj = data.payload.doc.data();
        let section = {
          name: unknownObj['name']
        }
        return section;
      });
    })
  }

  formatRut(run: number, dv: string) {
    return this.utilService.formatRut(run.toString() + dv);
  }

  // getAssitance() {
  //   const selectedDate = this.assistanceForm.get('assistanceDate').value;
  //   const selectedSection = this.assistanceForm.get('section').value;
  //   this.assistanceService.getAssistanceByDateAndSection(selectedDate, selectedSection)
  //     .subscribe(snapshot => {
  //       if (snapshot.length === 0) {
  //         Swal.fire('Consulta Asistencia', 'No se han registrado Asistenicas para la fecha consultada', 'info');
  //         return;
  //       }

  //       let rowCount = 0;
  //       const assistance = snapshot.map(userData => {
  //         return this.extractAssistanceData(userData.payload.doc.data());
  //       });
  //       let assistanceList = assistance[0];
  //       assistanceList.user_list.sort((a, b) => (a.lastName > b.lastName) ? 1 : (b.lastName > a.lastName) ? -1 : 0);
  //       const userDocArr = assistanceList.user_list.map(user => {
  //         const userDoc: UserDoc = {
  //           id: '',
  //           position: ++rowCount,
  //           data: user
  //         };
  //         return userDoc;
  //       });
  //       this.dataSource = new MatTableDataSource<UserDoc>(userDocArr);
  //       this.dataSource.paginator = this.paginator;
  //     },
  //       error => {
  //         console.log(`QueryAssistanceComponent::getAssitance Error -> ${error}`);
  //         Swal.fire('Error Consulta Asistencia', 'Se ha producido un error al consultar Asistencia', 'error');
  //       });
  // }

  extractAssistanceData(data: unknown): Assistance {
    const assistance: Assistance = {
      assistance_date: data['assistance_date'],
      section: data['section'],
      user_list: data['user_list']
    };

    return assistance;
  }

  getAssitance() {
    const selectedSection = this.assistanceForm.get('section').value;
    const selectedDate = this.assistanceForm.get('assistanceDate').value;
    // getting all students of a given section
    this.getAllUsersSubscription = this.userService.getUsersBySection(selectedSection).subscribe(
      snapshot => {
        let rowCount = 0;
        snapshot.sort((a, b) =>
          (a.payload.doc.data()['lastName'] > b.payload.doc.data()['lastName']) ?
            1 : (b.payload.doc.data()['lastName'] > a.payload.doc.data()['lastName']) ?
              -1 : 0);
        this.studentsBySection = snapshot.map(userData => {
          let userDoc: UserDoc = new UserDoc();
          userDoc.position = ++rowCount;
          userDoc.id = userData.payload.doc.id;
          userDoc.data = this.extractUserData(userData.payload.doc.data());
          return userDoc;
        });
        this.dataSource = new MatTableDataSource<UserDoc>(this.studentsBySection);
        this.dataSource.paginator = this.paginator;

        // getting the assistance by date and section
        this.assistanceService.getAssistanceByDateAndSection(selectedDate, selectedSection)
          .subscribe(snapshot => {
            if (snapshot.length === 0) {
              Swal.fire('Consulta Asistencia', 'No se han registrado Asistenicas para la fecha consultada', 'info');
              return;
            }

            let rowCount = 0;
            const assistance = snapshot.map(userData => {
              return this.extractAssistanceData(userData.payload.doc.data());
            });
            let assistanceList = assistance[0];
            assistanceList.user_list.sort((a, b) => (a.lastName > b.lastName) ? 1 : (b.lastName > a.lastName) ? -1 : 0);
            const userDocArr = assistanceList.user_list.map(user => {
              const userDoc: UserDoc = {
                id: '',
                position: ++rowCount,
                data: user
              };
              return userDoc;
            });

            this.dataSource.data.forEach(row => {
              const match = userDocArr.find(user => user.data.name === row.data.name && user.data.lastName === row.data.lastName);
              if (match !== undefined) {
                this.selection.select(row);
              }
            });
          },
            error => {
              console.log(`QueryAssistanceComponent::getAssitance Error -> ${error}`);
              Swal.fire('Error Consulta Asistencia', 'Se ha producido un error al consultar Asistencia', 'error');
            });
      }, error => {
        console.log(`IngresarAsistenciaComponent::getUsersBySection Error -> ${error}`);
        Swal.fire('Error al consultar Usuarios', error, 'error');
      }
    );
  }

  extractUserData(data: unknown): User {
    const user: User = {
      uid: data['uid'],
      name: data['name'],
      lastName: data['lastName'],
      email: data['email'],
      rut: data['rut'],
      dv: data['dv'],
      dob: data['dob'] ? data['dob'] : undefined,
      section: data['section']
    };

    return user;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserDoc): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
