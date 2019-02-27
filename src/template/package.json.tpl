{
  "name": "<%:=name%>",
  "version": "<%:=version%>",
  "description":  "<%:=description%>",
  "main":  "<%:=main%>",
  "scripts": {
    "start": "ucf-scripts start --homepage=index.html",
    "build": "ucf-scripts build"
  },
  "devDependencies": {
    "ucf-scripts": "^1.0.7"
  },
  "dependencies": {
            <%for(var key in dependencies) {%>
            <%if(!dependencies[key]) continue;%>
            <%:=`"${key}":"${dependencies[key]}",`%>\n
            <%}%>
        }\n
}
