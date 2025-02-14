import * as React from "react"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"
import zxcvbn from "zxcvbn"

const PasswordStrengthInput = React.forwardRef<HTMLInputElement,React.ComponentProps<"input">>(
     ({type="password",value,...props},ref)=>{
          const {score} = zxcvbn(value as string)
          const checkPassStrength = (score: zxcvbn.ZXCVBNScore) => {
               const returnData = {
                    0: {color: "#a0a0a0", text: 'Շատ թույլ է'},
                    1: {color: "#dc3545", text: 'Թույլ է'},
                    2: {color: "#ffad00", text: 'Բավարար է'},
                    3: {color: "#769246", text: 'Լավ է'},
                    4: {color: "#167051", text: 'Վստահելի է'},
               }
               return returnData[score] || {color: '', text: ''}
          }
          const passStrengthData = checkPassStrength(score)
          return (
               <>
                    <Input type={type} value={value} {...props} ref={ref}/>
                    <Progress value={score*25}/>
                    <p className="font-semibold text-right" style={{color: passStrengthData.color}}>{passStrengthData.text}</p>
               </>
          )
     }
)

PasswordStrengthInput.displayName = "PasswordStrengthInput"

export {PasswordStrengthInput}