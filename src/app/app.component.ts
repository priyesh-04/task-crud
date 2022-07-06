import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl  } from '@angular/forms';

function validatorTime(control: FormControl) {
    const time = control.value;
    if (time?.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/)) {
      return null;
    } else {
      return { 
        invalidTime: true 
      };
    }
  }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadForm: FormGroup;
  addForm: FormGroup;
  data: any = [
    {
      id: 1,
      date: new Date().toISOString().slice(0, 10),
      start_time: '11:00 AM',
      end_time: '12:00 PM',
      minutes: 60,
      description: 'test'
    }
  ]  

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadForm = this.fb.group({
      select_date: [new Date().toISOString().slice(0, 10)],
    });
    this.addForm = this.fb.group({
      id: [''],
      start_time: ['', [Validators.required, validatorTime]],
      end_time: ['', [Validators.required, validatorTime]],
      description: ['', [Validators.required]]
    });
  }

  ampm(time) {
  if (time.value !== "") {
    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    var suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours < 10 ? "0" + hours : hours;

    var displayTime = hours + ":" + minutes + " " + suffix;
    return displayTime
  }
}

calculateMinutes(startTime, endTime) {
  const start_time_arr = startTime.split(':');
  const end_time_arr = endTime.split(':');
  const start_hour = start_time_arr[0];
  const start_minute = start_time_arr[1];
  const end_hour = end_time_arr[0];
  const end_minute = end_time_arr[1];
  const start_time = parseInt(start_hour) * 60 + parseInt(start_minute);
  const end_time = parseInt(end_hour) * 60 + parseInt(end_minute);
  const minutes = end_time - start_time;
  return minutes;
}

  onLoad(form: FormGroup) {
    const date = form.value.select_date;
    this.data = this.data.filter(item => item.date === date);
  }

  onAdd(form: FormGroup) {
    const info = form.value;
    console.log(info,'id')
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id === info.id) {
        this.data[i].start_time = info.start_time;
        this.data[i].end_time = info.end_time;
        this.data[i].description = info.description;
        this.data[i].minutes = this.calculateMinutes(info.start_time, info.end_time);
        const elem = document.getElementById("add_btn");
        elem.innerHTML = 'Add';
        this.addForm.reset();
      }
        else {
          info.date = new Date().toISOString().slice(0, 10);
          info.id = Math.floor(Math.random() * Math.floor(100000));
          info.start_time = form.value.start_time;
          info.end_time = form.value.end_time;
          info.minutes = this.calculateMinutes(info.start_time, info.end_time);
          this.data.push(info);
          form.reset();
        }
      }
    console.log(this.data);
  }

  onEdit(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id === id) {
          const btnElem = document.getElementById("add_btn");
          btnElem.innerHTML = 'Update';
          this.addForm.get('id').setValue(this.data[i].id);
          this.addForm.get('start_time').setValue(this.data[i].start_time);
          this.addForm.get('end_time').setValue(this.data[i].end_time);
          this.addForm.get('description').setValue(this.data[i].description);
        }
      }
    }
    
  onDelete(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id === id) {
        this.data.splice(i, 1);
      }
    }
  }

  
}
