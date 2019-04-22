import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthService } from '../services/authService/auth.service';

@Component({
  selector: 'inactivity-timer',
  template: ``,
  styles: []
})
export class InactivityTimerComponent implements OnDestroy, OnInit {

  minutesDisplay = 0;
  secondsDisplay = 0;

  endTime = 1;

  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.resetTimer();
    this.authService.userActionOccured.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.resetTimer();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetTimer(endTime: number = this.endTime) {
    const interval = 1000;
    const duration = endTime * 300; // 5 Min User Inactivity.
    this.timerSubscription = timer(0, interval).pipe(
      take(duration)
    ).subscribe(value =>
      this.render((duration - +value) * interval),
      err => { },
      () => {
        if(this.authService.isLoggedIn()){
          this.authService.logout();
        }
      }
    )
  }

  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

}