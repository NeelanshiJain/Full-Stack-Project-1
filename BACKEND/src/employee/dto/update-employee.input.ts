import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class EmployeeUpdateDTO {
    @Field((type)=>Int)
    id: number
    @Field({ nullable: true })
    firstName: string
    @Field({ nullable: true })
    lastName: string
    @Field({ nullable: true })
    designation: string
    @Field({ nullable: true })
    city: string
    @Field({ nullable: true })
    projectId: string

}