
# Architecture: Container Diagram

The Container diagram models the high-level deployment architecture, execution runtimes, and local communication protocols within a single self-hosted node environment.

## 🎨 Container Diagram


```mermaid
graph LR
    User([Human Operator]) -->|HTTPS / Port 5173| SPA[React Single Page App]
    ExtSystem([External Systems]) -->|HTTP POST / Port 8000| API[FastAPI Backend Engine]
    
    subgraph Host_Machine [Self-Hosted Single-Node Machine]
        SPA -->|Local REST API Calls / Port 8000| API
        
        subgraph Python_Runtime [Python Process Layer]
            API -->|In-Process Method Calls| CoreEngine[Orchestration Engine]
            CoreEngine -->|SQLAlchemy Core / Object Mapping| DB[(SQLite Database File)]
            CoreEngine -->|File I/O Stream Appends| Logs[[JSONL Audit Logs]]
        end
    end
    
    CoreEngine -->|Outbound Network Actions| ExtSystem
    
    style Host_Machine fill:#fdfdfd,stroke:#222,stroke-width:2px
    style Python_Runtime fill:#f5f5f5,stroke:#444,stroke-width:1px,stroke-dasharray: 3 3
```
---

## 🗒️ Technical Specification & Communication Protocol

| **Container Name** | **Runtime Environment** | **Storage Type** | **Communication Protocol** | **Access Boundary** |
|:-------------------|:------------------------|:----------------:|---------------------------:|--------------------:|
| **React SPA** | Web Browser / Node Host | Ephemeral Memory | HTTP / JSON | Exposed locally to user network |
| **FastAPI Backend Engine** | Python 3.11+ / Uvicorn | In-Memory Core Run-Loop | HTTP REST / Webhook Ports | Internal network; webhooks exposed |
| **SQLite Database** | Local File System (`.db`) | Relational Storage Engine | Native File-system Call (POSIX) | Internal file access bounds only |
| **JSONL Logs** | Local File System (`.jsonl`) | Text Append Buffers | Line-Delimited File Append Stream | Internal file access bounds only |

---

## 🪛 Architecture Characteristics

### Local-First Data Privacy
Because all data processing containers reside on the user's private physical hardware, no processing contexts, token headers, or database rows leave the local infrastructure boundary. This design effectively mitigates security concerns regarding third-party transit risks.  

### Minimal Structural Latency
Traditional automation setups rely on periodic network polling to detect remote events, which can introduce message processing delays. By placing the FastAPI endpoint and the runtime loop within the same in-process boundary, incoming webhook notifications trigger immediate execution pipelines without network polling hops.  