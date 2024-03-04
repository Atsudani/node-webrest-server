import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";

// const todos = [

//     { id: 1, text: 'Buy PS5', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: null },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },

// ];


export class TodosController {
    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    //espress recomienda no usar async en el controller...

    public getTodos = (req: Request, res: Response) => {

        new GetTodos(this.todoRepository)
            .execute()
            .then( todos => res.json( todos )  )
            .catch(error => res.status(400).json({ error }));

    }

    public getTodosById = (req: Request, res: Response) => {
        const id = +req.params.id;

        new GetTodo(this.todoRepository)
            .execute(id)
            .then( todos => res.json( todos )  )
            .catch(error => res.status(400).json({ error }))


    }

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);

        if (error) return res.status(400).json({ error });

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then( todos => res.json( todos ))
            .catch(error => res.status(400).json({ error }));
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body, id
        });

        if (error) return res.status(400).json({ error });



        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then( todos => res.json( todos ) )
            .catch(error => res.status(400).json({ error }));


    }


    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then( todos => res.json( todos ) )
            .catch(error => res.status(400).json({ error }));
    }
}