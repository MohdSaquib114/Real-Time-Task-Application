import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express";
import { sendTaskUpdate } from "./producer";

const client = new PrismaClient()

export const getAllTask = async(req:Request,res:Response) => {
    try {
        const allTask = await client.task.findMany()
        if(allTask.length < 0 ){
             res.status(400).json({
                success:false,
                message:"No task"
            })
            return
        }
         res.status(200).json({
            success:true,
            tasks:allTask
        })
        return
    } catch (error) {
         res.status(400).json({
            success:false,
            message:"Something went wrong!"
      
        })
        
    }
}
export const getTaskById =async(req:Request,res:Response)=> {
    try {
                    
       
        const {id } = req.params
       
        const task  = await client.task.findFirst({
            where:{
                id:id
            }
})

if(!task){

    res.status(400).json({
        success:false,
        message:"No task found "
    })
    return
}
res.status(200).json({
    success:true,
    task:task
})

} catch (error) {
    res.status(400).json({
        success:false,
        message:"Task does not find. Something went wrong!"

    })
  
}
}


export const deleteTaskById = async(req:Request,res:Response) => {
    try {
                    
       
        const {id } = req.params
       
      const deleteTask =   await client.task.delete({
            where:{
                id:id
            }
})

   sendTaskUpdate({
    id:deleteTask.id,
    action:"Task Deleted"
   })
res.status(200).json({
    success:true,
    message:"Task Deleted"
})

 
} catch (error) {
    res.status(400).json({
        success:false,
        message:"Task does not delete. Something went wrong!"

    })
    
}

}


export const createTask = async(req:Request,res:Response) => {
    try {
        
        const {description} = req.body
        if(!description){
            res.status(400).json({
                success:false,
                message:"Descrpition is not given"
            })
            return
        }
        const newTask = await client.task.create({
        data:{
            description: description,
  created_at: new Date().toISOString(),
  status:"PENDING",
  updated_at: new Date().toISOString(),
  
}
})
sendTaskUpdate({
    id:newTask.id,
    action:"Task Created"
   })
res.status(200).json({
    success:true,
    task:newTask
})
 
} catch (error) {
    res.status(400).json({
        success:false,
        message:"Task does not create. Something went wrong!"
  
    })
 
}
}



export const updateTaskById = async(req:Request,res:Response) => {
                try {
                    
                    const {description,status} = req.body
                    const {id } = req.params
                    if(!description || !status){
                        res.status(400).json({
                            success:false,
                            message:"Body is not given"
                        })
                        return
                    }
                    const newTask = await client.task.update({
                        where:{
                            id:id
                        },
                    data:{
                        description: description,
            created_at: new Date().toISOString(),
            status:status,
            updated_at: new Date().toISOString(),
            
            }
            })

            sendTaskUpdate({
                id:newTask.id,
                action:"Task Updated"
               })

            res.status(200).json({
                success:true,
                task:newTask
            })

          
            } catch (error) {
                res.status(400).json({
                    success:false,
                    message:"Task does not update. Something went wrong!"
            
                })
                
            }

}
