import { Request, Response } from "express";
import { create } from "node:domain";
import { todo } from "node:test";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

// const todos = [
            
//     { id: 1, text: 'Buy PS5', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: null },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },

// ];


export class TodosController {
    //* DI
    constructor(){}

    public getTodos = async (req: Request,res: Response) => {
        const todos = await prisma.todo.findMany();
        
        res.json(todos);
    }

    public getTodosById = async (req: Request,res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({error: 'ID argument is not a number'});

        // const todo = todos.find( todo => todo.id === id);
        const todo = await prisma.todo.findFirst({
            where: { id }
        });


        ( todo )
            ? res.json(todo)
            : res.status(404).json( {error: `TODO with id ${ id } not found.`})


        res.json(todo);
    }

    public createTodo = async (req: Request, res: Response) => {
        //const { text, completedAt } = req.body;
        
        const [ error, createTodoDto ] = CreateTodoDto.create(req.body);
        
        //if ( !text ) return res.status(400).json({ error: 'Text property is required'});
        if ( error ) return res.status(400).json({ error});
        
        
        
        // const todo = await prisma.todo.create({
            //     data: { text, completedAt }
            // });
            
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });


        // const newTodo = {
        //     id: todos.length + 1,
        //     text,
        //     completedAt: null
        // }

        // todos.push( newTodo );


        res.json( todo );
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        // if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number'});

        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body, id
        });

        if ( error ) return res.status(400).json({ error });
        
        //const todo = todos.find( todo => todo.id === id);
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        
        if ( !todo ) return res.status(400).json({ error: `Todo with id ${ id } not found`});
        
        // const { text, completedAt } = req.body;
        //if ( !text ) return res.status(400).json({ error: `Text property is required!..`});

        // todo.text = text || todo.text; // si text tiene valor, tomará el text, sino, tomará todo.text 
        // ( completedAt === 'null')
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date( completedAt || todo.completedAt);

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        //!OJO, referencia
        // todos.forEach( (todo,index) => {
        //     if ( todo.id === id ) { //si el id del todo actual del arreglo es igual al id que recibo del parametro de la url
        //         todos[index] = todo;
        //     }
        // });

        res.json( updatedTodo );


    }


    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        // const todo = todos.find( todo => todo.id === id );
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if ( !todo ) return res.status(404).json({error: `Todo with id ${ id } not found!!..`});

        // todos.splice( todos.indexOf(todo),1);
        
        const deleted = await prisma.todo.delete({
            where: { id }
        });

        ( deleted )
            ? res.json( deleted)
            : res.status(400).json({ error: `Todo with id ${ id } not found.`})
        res.json( { todo, deleted } );

    }
}