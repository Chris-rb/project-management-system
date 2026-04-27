# ProjectTracker.API/Dockerfile

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ProjectTracker.Core/ProjectTracker.Core.csproj ProjectTracker.Core/
COPY ProjectTracker.API/ProjectTracker.API.csproj ProjectTracker.API/
RUN dotnet restore ProjectTracker.API/ProjectTracker.API.csproj

COPY ProjectTracker.Core/ ProjectTracker.Core/
COPY ProjectTracker.API/ ProjectTracker.API/
WORKDIR /src/ProjectTracker.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProjectTracker.API.dll"]