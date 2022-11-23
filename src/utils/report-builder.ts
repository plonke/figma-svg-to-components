type ReplaceLog = {
    replacedIn: string[], notReplacedIn: string[]
};


export class ReportBuilder {
    private fill: ReplaceLog = { replacedIn: [], notReplacedIn: [] }
    private stroke: ReplaceLog = { replacedIn: [], notReplacedIn: [] }

    public addFill(isReplaced: boolean, name: string) {
        this.fill[isReplaced ? 'replacedIn' : 'notReplacedIn'].push(name);
    }

    public addStroke(isReplaced: boolean, name: string) {
        this.stroke[isReplaced ? 'replacedIn' : 'notReplacedIn'].push(name);
    }

    toString():string {
        let text = '';

        text += `FILL NOT REPLACED IN:\n`;
        text += this.fill.notReplacedIn.join('\n');

        text += '\n\n';

        text += `FILL REPLACED IN:\n`;
        text += this.fill.replacedIn.join('\n');

        text += '\n\n—————\n\n';

        text += `STROKE NOT REPLACED IN:\n`;
        text += this.stroke.notReplacedIn.join('\n');

        text += '\n\n';

        text += `STROKE REPLACED IN:\n`;
        text += this.stroke.replacedIn.join('\n');

        return text;
    }
}