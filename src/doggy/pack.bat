set GOPATH=%cd%\..\..\
set GOARCH=amd64
set GOOS=windows
go build
del/s/q eagle.7z
7z.exe a eagle.7z static\* views\* eagle.exe