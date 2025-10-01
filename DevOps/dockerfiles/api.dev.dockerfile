FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /src

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

COPY API/API.csproj ./API/
RUN dotnet restore "API/API.csproj"

COPY API/. ./API/
WORKDIR /src/API

EXPOSE 5000
CMD ["dotnet", "watch", "run", "--no-hot-reload", "--urls", "http://0.0.0.0:5000"]
