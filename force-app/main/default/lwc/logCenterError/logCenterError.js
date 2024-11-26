import { LightningElement, api } from 'lwc';
export default class LogCenterError extends LightningElement {
    @api errors = [];
    @api hasErrors = false;
}