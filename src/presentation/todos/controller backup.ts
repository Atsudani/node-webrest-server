import { Request, Response } from "express";
import { create } from "node:domain";
import { todo } from "node:test";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

// const todos = [
            
//     { id: 1, text: 'Buy PS5', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: null },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },

// ];


export class TodosController {
    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ){}

    public getTodos = async (req: Request,res: Response) => {
        // const todos = await prisma.todo.findMany();
        // res.json(todos);

        const todos = await this.todoRepository.getAll();
        
        // console.log( todos );

        return res.json( todos );
    }

    public getTodosById = async (req: Request,res: Response) => {
        const id = +req.params.id;

        try {
            
            const todo = await this.todoRepository.findById( id );
            res.json(todo);

        } catch (error) {
            res.status(400).json({ error });
        }


        //sin arquitectura limpia.. prisma y arreglos..
        // if (isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});

        // // const todo = todos.find( todo => todo.id === id);
        // const todo = await prisma.todo.findFirst({
        //     where: { id }
        // });


        // ( todo )
        //     ? res.json(todo)
        //     : res.status(404).json( {error: `TODO with id ${ id } not found.`})


    }

    public createTodo = async (req: Request, res: Response) => {
        const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
        
        if ( error ) return res.status(400).json({ error});
        
        const todo = await this.todoRepository.create( createTodoDto! );
        res.json( todo );
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body, id
        });

        if ( error ) return res.status(400).json({ error });
        
        const updateTodo = await this.todoRepository.updateById( updateTodoDto! );
        return res.json( updateTodo );


    }


    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const deletedTodo = await this.todoRepository.deleteById( id );
        res.json( deletedTodo );
    }
}