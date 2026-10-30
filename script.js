let employees=[
    {
        name:"田中",
        task:"業務Aを担当中",
        skills:["業務A","業務B","業務C"],
    },
    {
        name:"佐藤",
        task:"業務Bを担当中",
        skills:["業務B"],
    },
    {
        name:"鈴木",
        task:"待機中",
        skills:["業務A","業務C"],
    }
];
const savedEmployees=JSON.parse(
    localStorage.getItem("savedEmployees")||"null"
);
if(Array.isArray(savedEmployees)){
    employees=savedEmployees;
}
const savedSkills=JSON.parse(localStorage.getItem("savedSkills"));
if(savedSkills){
   employees.forEach(function(employee){
       if(savedSkills[employee.name]){
          employee.skills=savedSkills[employee.name];
       }
   });
}
const savedTasks=JSON.parse(localStorage.getItem("employeeTasks"));
if(savedTasks){
    employees.forEach(function(employee){
        const saved=savedTasks.find(
            person=>person.name==employee.name
        );
        if(saved){
            employee.task=saved.task;
        }
    });
}
let allSkills=["業務A","業務B","業務C"];
const savedAllSkills=JSON.parse(
    localStorage.getItem("allSkills")||"null"
);
console.log("保存元確認:",localStorage.getItem("allSkills"));
console.log("読み込み確認:",savedAllSkills);
if(Array.isArray(savedAllSkills)){
    allSkills=savedAllSkills;
}
const employeeList=document.getElementById("employee-list");
function renderEmployees(){
    employeeList.innerHTML="";
employees.forEach(function (employee) {
   const box=document.createElement("div");
   const title=document.createElement("h3");
   title.textContent=(employee.name||"").endsWith("さん")?employee.name:(employee.name||"")+"さん";
   const progressText=document.createElement("p");
   function updataProgress(){
    const count=allSkills.filter(skill=>employee.skills.includes(skill)).length;
    const total=allSkills.length;
    const percent=total===0?0:Math.round(count/total*100);
    progressText.textContent="業務習得率:"+percent+"%";
   }
   updataProgress();
   box.appendChild(title);
   const editButton=document.createElement("button");
   editButton.textContent="編集";
   box.appendChild(editButton);
   const deleteButton=document.createElement("button");
   deleteButton.textContent="削除";
   box.appendChild(deleteButton);
   deleteButton.addEventListener("click",function(){
    const ok=confirm(employee.name+"を削除しますか？");
    if(!ok){
        return;
    }
    employees=employees.filter(function(person){
        return person!==employee;
    });
    localStorage.setItem(
        "savedEmployees",
        JSON.stringify(employees)
    );
    renderEmployees();
   });
   editButton.addEventListener("click",function(){
    const newName=prompt("新しい名前を入力してください",employee.name);
    if(newName===null||newName.trim()===""){
        return;
    }
    const oldName=employee.name;
    const changedName=newName.trim();
    if(employees.some(person=>
        person!==employee&&person.name===changedName
    )){
        alert("同じ名前のスタッフが登録されています");
        return;
    }
    const savedSkills=JSON.parse(
        localStorage.getItem("savedSkills")||"{}"
    );
    if(Object.hasOwn(savedSkills,oldName)){
        savedSkills[changedName]=savedSkills[oldName];
        delete savedSkills[oldName];
        localStorage.setItem(
            "savedSkills",
            JSON.stringify(savedSkills)
        );
    }
    employee.name=changedName;
    localStorage.setItem(
        "savedEmployees",
        JSON.stringify(employees)
    );
    renderEmployees();
    alert("名前を変更しました");
   });
   box.appendChild(progressText);
   const datails=document.createElement("div");
   datails.hidden=true;
   box.appendChild(datails);
   title.style.cursor="pointer";
   title.addEventListener("click",function(){
    datails.hidden=!datails.hidden;
   });
   if(allSkills.every(skill=>employee.skills.includes(skill))){
      title.style.color="green";
   }
   allSkills.forEach(function(skill){
    const label=document.createElement("label");
    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=employee.skills.includes(skill);
    checkbox.addEventListener("change",function(){
        if(checkbox.checked){
            if(!employee.skills.includes(skill)){
               employee.skills.push(skill);
            }
        }else{
            employee.skills=employee.skills.filter(s => s !==skill);
        }
        if(allSkills.every(s=>employee.skills.includes(s))){
           title.style.color="green";
        }else{
            title.style.color="black";
        }
        const data={};
        employees.forEach(function(person){
            data[person.name]=person.skills;
        });
        localStorage.setItem("savedSkills",JSON.stringify(data));
        updataProgress();
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(skill));
    datails.appendChild(label);
    datails.appendChild(document.createElement("br"));
   });
   employeeList.appendChild(box);
});
}
renderEmployees();
const pages={
    staff: document.getElementById("staff-page"),
    search: document.getElementById("search-page"),
    manage: document.getElementById("manage-page")
};
function showPage(pageName){
    Object.values(pages).forEach(function(page){
        page.hidden=true;
    });
    pages[pageName].hidden=false;
}
document.getElementById("staff-button").addEventListener("click",function(){
    showPage("staff");
});
document.getElementById("search-button").addEventListener("click",function(){
    showPage("search");
});
document.getElementById("manage-button").addEventListener("click",function(){
    showPage("manage");
});
Object.values(pages).forEach(function(page){
    page.hidden=true;
});
document.getElementById("add-employee-button").addEventListener("click",function(){
    const name=prompt("追加するスタッフの名前を入力してください");
    if(name==null || name.trim()===""){
        return;
    }
    employees.push({
        name: name.trim(),
        task: "未設定",
        skills: []
    });
    localStorage.setItem("savedEmployees",JSON.stringify(employees));
    renderEmployees();
    alert(name.trim()+"さんを追加しました");
});
document.getElementById("add-skill-button").addEventListener("click",function(){
    const newSkill=prompt("追加する業務名を入力してください");
    if(newSkill===null||newSkill.trim()===""){
        return;
    }
    const skillName=newSkill.trim();
    if(allSkills.includes(skillName)){
        alert("その業務は既に登録されています");
        return;
    }
    allSkills.push(skillName);
    localStorage.setItem(
        "allSkills",
        JSON.stringify(allSkills)
    );
    renderEmployees();
    renderSkills();
    renderSkillsSearch();
});
const showSkillsButton=document.getElementById("show-skills-button");
const skillsList=document.getElementById("skills-list");
showSkillsButton.addEventListener("click",function(){
    skillsList.hidden=!skillsList.hidden;
});
function renderSkills(){
    skillsList.innerHTML="";
    allSkills.forEach(function(skill){
        const p=document.createElement("p");
        p.textContent=skill;
        skillsList.appendChild(p);
        const editSkillButton=document.createElement("button");
        editSkillButton.textContent="編集";
        skillsList.appendChild(editSkillButton);
        const deleteSkillButton=document.createElement("button");
        deleteSkillButton.textContent="削除";
        skillsList.appendChild(deleteSkillButton);
        deleteSkillButton.addEventListener("click",function(){
            const ok=confirm(skill+"を削除しますか？");
            if(!ok){
                return;
            }
            allSkills=allSkills.filter(function(s){
                return s !== skill;
            });
            employees.forEach(function(employee){
                employee.skills=employee.skills.filter(function(s){
                    return s != skill;
                });
            });
            localStorage.setItem("allSkills",JSON.stringify(allSkills));
            localStorage.setItem("savedEmployees",JSON.stringify(employees));
            renderEmployees();
            renderSkills();
            renderSkillsSearch();
        });
        editSkillButton.addEventListener("click",function(){
            const newName=prompt("変更後の業務名を入力してください",skill);
            if(newName===null||newName.trim()===""){
                return;
            }
            const changedName=newName.trim();
            if(allSkills.includes(changedName)&&changedName!==skill){
                alert("その業務名は既に登録されています");
                return;
            }
            const index=allSkills.indexOf(skill);
            allSkills[index]=changedName;
            employees.forEach(function(employee){
                employee.skills=employee.skills.map(function(s){
                    return s===skill?changedName:s;
                });
            });
            localStorage.setItem("allSkills",JSON.stringify(allSkills));
            localStorage.setItem("savedEmployees",JSON.stringify(employees));
            renderEmployees();
            renderSkills();
            renderSkillsSearch();
        });
    });
}
renderSkills();
const skillSearch=document.getElementById("skill-search");
const searchResults=document.getElementById("search-results");
function renderSkillsSearch(){
    skillSearch.innerHTML="";
    allSkills.forEach(function(skill){
        const option=document.createElement("option");
        option.value=skill;
        option.textContent=skill;
        skillSearch.appendChild(option);  
    });
    skillSearch.dispatchEvent(new Event("change"));
}
renderSkillsSearch();
skillSearch.addEventListener("change",function(){
    const selectedSkill=skillSearch.value;
    console.log("選択した業務:",selectedSkill);
    const matchedEmployees=employees.filter(function(employee){
        return employee.skills.includes(selectedSkill);
    });
    searchResults.innerHTML="";
    if(matchedEmployees.length===0){
        searchResults.textContent="この業務を担当しているスタッフはいません";
        return;
    }
    matchedEmployees.forEach(function(employee){
        const p=document.createElement("p");
        p.textContent=employee.name.endsWith("さん")
        ? employee.name
        : employee.name+"さん";
        searchResults.appendChild(p);
    });
});
skillSearch.dispatchEvent(new Event("change"));
document.getElementById("home-button").addEventListener("click",function(){
    document.getElementById("staff-page").hidden=false;
    document.getElementById("search-page").hidden=true;
    document.getElementById("manage-page").hidden=true;
});