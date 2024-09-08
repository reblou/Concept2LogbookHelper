#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Prevent 'Warning: apt-key output should not be parsed (stdout is not a terminal)'
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release


# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb

USER root


RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    node -v

## end node bit


WORKDIR /src
COPY ["concept2logbookhelper.client/nuget.config", "concept2logbookhelper.client/"]
COPY ["Concept2LogbookHelper.Server/Concept2LogbookHelper.Server.csproj", "Concept2LogbookHelper.Server/"]
COPY ["concept2logbookhelper.client/concept2logbookhelper.client.esproj", "concept2logbookhelper.client/"]
RUN dotnet restore "./Concept2LogbookHelper.Server/Concept2LogbookHelper.Server.csproj"
COPY . .
WORKDIR "/src/Concept2LogbookHelper.Server"
RUN dotnet build "./Concept2LogbookHelper.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Concept2LogbookHelper.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Concept2LogbookHelper.Server.dll"]