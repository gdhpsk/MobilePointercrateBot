module.exports = (person, levels) => {
  let levelPos = Object.keys(levels)
  let arrayOfPoints = 200
  let point = 0
  if(person.completions[0] != "none") {
    for(let i = 0; i < person.completions.length; i++) {
      let k = levelPos.findIndex(e => e == person.completions[i].name)
      if(Math.round(100*(arrayOfPoints-(1.95*k)))/100 < 6.95) {
        point += 0
      } else {
      point += Math.round(100*(arrayOfPoints-(1.95*k)))/100
}
      if(person.completions[i].remove && Math.round(100*(arrayOfPoints-(1.95*k)))/100 >= 4.8) {
        point -= Math.round(100*(arrayOfPoints-(1.95*k)))/100
      }
    }
      
    }
    if(person.progresses[0] != "none") {
    for(let i = 0; i < person.progresses.length; i++) {
      let k = levelPos.findIndex(e => e == person.progresses[i].name)
      point += Math.round(100*(arrayOfPoints-(1.95*k))/3)/100
      if(Math.round(100*(arrayOfPoints-(1.95*k))/3)/100 >= 34.82 && person.progresses[i].remove) {
        point -= Math.round(100*(arrayOfPoints-(1.95*k))/3)/100
      }
}
    }
  return Math.round(100*point)/100
}