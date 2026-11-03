package com.lackji.project2.Handler;

import jakarta.validation.constraints.Null;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SocketHandler extends TextWebSocketHandler {
//
//    List<WebSocketSession> webSocketSessionList =
//            Collections.synchronizedList(new ArrayList<>());

    private final Map<UUID, Set<WebSocketSession>> projectRooms= new ConcurrentHashMap<>();

    private static final String PROJECT_ID="projectId";

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);


        //get the uri and try to read the project id using uri

        String id= UriComponentsBuilder.fromUri(session.getUri())
                        .build()
                                .getQueryParams()
                                        .getFirst(PROJECT_ID);

     try {
         UUID projectId= UUID.fromString(id);

         session.getAttributes().put(PROJECT_ID,projectId);

         //adding the session that are active to the hashset
         projectRooms.computeIfAbsent(projectId,key -> ConcurrentHashMap.newKeySet()).add(session);
     }
     catch (
             IllegalArgumentException | NullPointerException e
     ){
         session.close(CloseStatus.BAD_DATA);
     }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status)
            throws Exception {
        super.afterConnectionClosed(session, status);

        UUID projectId=(UUID) session.getAttributes().get(PROJECT_ID);

        if(projectId== null) return;

        Set<WebSocketSession> sessions=projectRooms.get(projectId);
        if(session!=null){
            sessions.remove(session);
        }

        if(sessions.isEmpty()){
            projectRooms.remove(projectId,sessions);
        }
    }

    @Override
    public void handleMessage(WebSocketSession session,
                              WebSocketMessage<?> message)
            throws Exception {
        super.handleMessage(session, message);

        //access uuid
        UUID projectId = (UUID) session.getAttributes().get(PROJECT_ID);

        if (projectId == null) return;
        //acces session and give to project room and the hashset

        Set<WebSocketSession> sessions = projectRooms.get(projectId);

        if (sessions == null) return;

    for(WebSocketSession s:sessions){
        {
            if (!s.equals(session) && s.isOpen())
                s.sendMessage(message);
        }

        s.sendMessage(message);
    }

    }
}
