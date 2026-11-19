export function calculateScore(questions,answers){
 const total=questions.length;
 const correct=questions.filter(q=>answers[q.id]===q.answer).length;
 const unanswered=questions.filter(q=>!Number.isInteger(answers[q.id])).length;
 return {total,correct,unanswered,wrong:total-correct-unanswered,percent:total?Math.round(correct/total*100):0};
}
export function shuffle(items,random=Math.random){
 const result=[...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
