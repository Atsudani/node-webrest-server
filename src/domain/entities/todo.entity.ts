


export class TodoEntity {

    constructor(
        public readonly id: number,
        public readonly text: string,
        public readonly completeAt?: Date | null,
    ){}

    get isCompleted() {
        return !!this.completeAt;
    }

    public static fromObject( object: {[key: string]: any} ): TodoEntity {
        const { id, text, completedAt } = object;
        if ( !id ) throw 'Id is required';
        if ( !text ) throw 'Id is required';

        let newCompletedAt;
        if ( completedAt ) {
            newCompletedAt = new Date(completedAt);
            if ( isNaN( newCompletedAt.getMinutes() ) ) {
                throw 'CompletedAt is not a valid date'
            }
        }

        return new TodoEntity( id, text, completedAt );

    }

    
}