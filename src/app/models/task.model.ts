export interface Task {
  activity: string
  date: string | Date
  finally: boolean
  hour: number
  id_autor: string
  id_collaborators?: string[]
  title: string
  req: boolean
}

export interface TaskX {
  id: string
  task: Task
}

export interface TaskList extends Array<TaskX> {}

export interface HourChart {
  finallys: number
  opens: number
  missing: number
}
export interface UserTask {
  user: string
  task:Task[]
}
//Example
//   activity: "Se apoya a compañero para finalizar el requisito"
//   date: "12/02/2023"
//   finally: false
//   hour: 2
//   id_autor: "1RbiGJqboqeYDxKLqQMxVcXL9w63"
//   id_collaborators: ["XCb7kpvxFjRxfiRO0lU4SF1qNX32", "d9RRkBulYPdR8TRuDw4bYPPR9VB3"]
//   title: "Apoyo Compañeros"
